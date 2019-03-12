import { GraphQLServer } from 'graphql-yoga'

// type definitions (schema)

const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '2',
    name: 'sarah',
    email: 'sara@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

const posts = [{
    id: '1',
    title: 'help',
    body: 'coding forever and ever and ever',
    author: '1'
}, {
    id: '2',
    title: 'help',
    body: 'more eggs on the roof',
    author: '2'
}]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User! 
        posts(query: String): [Post!]!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        author: User!
    }
`
//resolver or api

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: '123098',
                name: 'Brendan',
                email: 'brendan.m.j.shields@gmail.com',
                age: 29
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return titleMatch || bodyMatch
            })
        }
     },
     Post: {
         author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
         }
     }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('running')
})