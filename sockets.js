const init = (io) => {

  io.on('connection', socket => {
    socket.on('enterClassroom', classroomId => {
      socket.broadcast.emit('enterClassroom', classroomId)
    })
    socket.on('leaveClassroom', classroomId => {
      socket.broadcast.emit('leaveClassroom', classroomId)
    })
  })

  const special = io.of('special')
  special.on('connection', () => {
  })
}

module.exports = {init}