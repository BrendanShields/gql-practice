import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
// type definitions (schema)

let users = [{
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

let comments = [{
    id: '101',
    text: 'this is some text',
    author: '1',
    post: '1'
}, {
    id: '102',
    text: 'some more text',
    author: '2',
    post: '2'
}, {
    id: '103',
    text: 'there is so much text',
    author: '3',
    post: '2'
}]

let posts = [{
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
        comments: [Comment!]!
        me: User! 
        posts(query: String): [Post!]!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!,
        email: String!,
        age: Int
    }

    input CreateCommentInput {
        text: String!,
        author: String!,
        post: String!
    }
    
    input CreatePostInput {
        title: String!,
        body: String!,
        author: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Comment {
        id: String!
        text: String!
        author: User!
        post: Post!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        author: User!
        comment: [Comment!]!
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
        },
        comments() {
            return comments
        },
     },
     Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('user not found')
            }

        const deletedUsers = users.splice(userIndex, 1)
        
        posts = posts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                comments = comments.filter((comment) => comment.post !== post.id)
            }      
            return !match
        })

            comments = comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
        
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User not found!')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if (postIndex === -1) {
                throw new Error('Post not found')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const postExists = posts.some((post) => post.id === args.data.post)
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User not found')
            }

            if (!postExists) {
                throw new Error('Post not found')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, ctx, info) {

            const commentIndex = comments.findIndex((comment) => comment.id === args.id)

            if (commentIndex === -1) {
                throw new Error('Comment not found')
            }

            const deletedComments = comments.splice(commentIndex, 1)

            return deletedComments[0]
        }
    },
     Post: {
         author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
         },
         comment(parent, args, ctx, info) {
             return comments.filter((comment) => {
                return comment.post === parent.id
             })
         }
     },
     User: {
         posts(parent,args,ctx,info) {
             return posts.filter((post) => {
                 return post.author === parent.id
             })
         },
         comments(parent, args, ctx, info) {
             return comments.filter((comment) => {
                 return comment.author === parent.id
             })
         }
     },
     Comment: {
         author(parent, args, ctx, info) {
             return users.find((user) => {
                 return user.id === parent.author
             })
         },
         post(parent, args, ctx, info) {
             return posts.find((post) => {
                 return post.id === parent.post
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