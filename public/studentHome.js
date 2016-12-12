const App = {
  init() {
    this.initComponents()
    this.initStudentProgress()
    this.bindEvents()
    this.socket = io()
  },

  initComponents() {

  },

  initStudentProgress() {
    $.getJSON('/classroom/progress', (studentProgressByClassroom) => {
      $.each(studentProgressByClassroom, (classroomId, progress) => {
        let $classroom = $(`.classroomCard[data-id="${classroomId}"]`).first()
        let $progress = $classroom.find('.studentProgress')
        $progress.progress({
          text: {
            active: '{value} of {total} tasks completed',
            success: 'All Tasks Complete!'
          }
        })
        $progress.progress('set total', progress.totalTasks)
        $progress.progress('set progress', progress.totalSubmissions)
      })
    })
  },

  bindEvents() {

    $('.classroomCard').on('click', (e) => {
      let $classroomCard = $(e.target).closest('.classroomCard')
      let id = $classroomCard.data('id')

      //enter the class
      $.ajax({
        url: `/enterClassroom/${id}`,
        method: 'POST'
      })

      window.location.href = `/student/classroom/${id}`
    })
  },

}

$(() => {
  App.init()
})