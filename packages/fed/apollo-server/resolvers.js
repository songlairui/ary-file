import GraphQLJSON from 'graphql-type-json';
import shortid from 'shortid';
import { join } from 'path';
import { readdir, stat } from 'fs-extra';

const HOME = process.env.HOME;

export default {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },

  Query: {
    ls: async (
      root,
      { dir = '.', first = 0, limit = 200, showHidden = false }
    ) => {
      console.info('dir, root', HOME, dir);
      const target = join(HOME, dir);
      let files = await readdir(target);
      if (!showHidden) {
        files = files.filter(filename => !filename.startsWith('.'));
      }
      files = files.slice(first, first + limit);
      return await Promise.all(
        files.map(async item => {
          const subTarget = join(target, item);
          const state = await stat(subTarget);
          return {
            name: item,
            isDir: state.isDirectory()
          };
        })
      );
    },
    hello: (root, { name }) => `Hello ${name || 'World'}!`,
    messages: (root, args, { db }) => db.get('messages').value(),
    uploads: (root, args, { db }) => db.get('uploads').value()
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!';
      context.pubsub.publish('hey', { mySub: message });
      return message;
    },
    addMessage: (root, { input }, { pubsub, db }) => {
      const message = {
        id: shortid.generate(),
        text: input.text
      };

      db.get('messages')
        .push(message)
        .last()
        .write();

      pubsub.publish('messages', { messageAdded: message });

      return message;
    },

    singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root, { files }, { processUpload }) =>
      Promise.all(files.map(processUpload))
  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('hey')
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15); // random channel name
        let count = 0;
        setInterval(
          () =>
            pubsub.publish(channel, {
              // eslint-disable-next-line no-plusplus
              counter: { count: count++ }
            }),
          2000
        );
        return pubsub.asyncIterator(channel);
      }
    },

    messageAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('messages')
    }
  }
};
