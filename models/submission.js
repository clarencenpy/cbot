const submissionsCollection = []
const addSubmission = (userId, taskId, code) => {
  if (!findSubmission(userId, taskId)) { //does not exist yet
    submissionsCollection.push({userId, taskId, code})
    return true
  }
}
const findSubmission = (userId, taskId) => {
  return submissionsCollection.find((s) => {
    return s.taskId === taskId && s.userId === userId
  })
}

const getAllSubmissions = () => {
  return submissionsCollection
}

const updateSubmission = (userId, taskId, code) => {
  for (let c of submissionsCollection) {
    if (c.userId === userId && c.taskId === taskId) {
      c.code = code //update
      return true
    }
  }
  //falsy value is returned if submission does not exist
}
const deleteSubmission = (userId, taskId) => {
  const i = submissionsCollection.findIndex((s) => {
    return s.userId === userId && s.taskId === taskId
  })
  if (i !== -1) {
    submissionsCollection.splice(i, 1)
    return true
  }
}

module.exports = {
  addSubmission,
  findSubmission,
  getAllSubmissions,
  updateSubmission,
  deleteSubmission
}