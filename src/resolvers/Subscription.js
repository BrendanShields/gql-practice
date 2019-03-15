const Subscription = {
    comment: {
        subscribe(parent, { postId }, { pubsub, db }, info) {
            const post = db.posts.find((post) => post.id === postId)

            if (!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, { authorId }, { pubsub, db }, info){
            return pubsub.asyncIterator(`post`)
        }
    }
}

export { Subscription as default }