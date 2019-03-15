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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}

export { db as default }