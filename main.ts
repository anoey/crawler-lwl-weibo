import { Comment, commentsCollection} from "./mongo.ts"

async function getComments() {
  const targetUrl = 'https://weibo.com/ajax/statuses/buildComments?is_reload=1&id=4467107636950632&is_show_bulletin=2&count=10'

  const res = await fetch(targetUrl)
  const data = await res.json()

  // deno-lint-ignore no-explicit-any
  const comments = data.data.map((item: any) => ({
    content: item.text_raw,
    user: item.user.screen_name,
    time: new Date(item.created_at).getTime(),
  }))

  return comments
}
let oldComments = (await commentsCollection.find().toArray()).splice(0, 10)

while (true) {
  const comments = await getComments()

  // filter out the old comments
  const insertComments = comments.filter((comment: Comment) => {
    return !oldComments.some((oldComment: Comment) => oldComment.content === comment.content)
  })

  if (insertComments.length !== 0) {
    commentsCollection.insertMany(insertComments)
  }
  oldComments = comments

  console.log('inserted', insertComments.length, 'comments')

  await new Promise((resolve) => setTimeout(resolve, 1000 * 60))
}