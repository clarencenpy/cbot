const updateCollection = () => {
  $.get('/submissions', (data) => {
    $('#collection').html(data)
  })
}

$(() => {
  $('#putBtn').on('click', () => {
    const userId = $('#userId').val()
    const taskId = $('#taskId').val()
    const code = $('#code').val()
    $.ajax({
      method: 'PUT',
      url: `submission/${userId}/${taskId}`,
      data: code,
      contentType: 'text/plain',
      success: (data) => {
        $('#status').text(JSON.stringify(data))
        updateCollection()
      }
    })
  })

  $('#getBtn').on('click', () => {
    const userId = $('#userId').val()
    const taskId = $('#taskId').val()
    $.ajax({
      method: 'GET',
      url: `submission/${userId}/${taskId}`,
      success: (data) => {
        $('#status').text(JSON.stringify(data))
        updateCollection()
      }
    })
  })

  $('#postBtn').on('click', () => {
    const userId = $('#userId').val()
    const taskId = $('#taskId').val()
    const code = $('#code').val()
    $.ajax({
      method: 'POST',
      url: `submission/${userId}/${taskId}`,
      data: code,
      contentType: 'text/plain',
      success: (data) => {
        $('#status').text(JSON.stringify(data))
        updateCollection()
      }
    })
  })

  $('#deleteBtn').on('click', () => {
    const userId = $('#userId').val()
    const taskId = $('#taskId').val()
    $.ajax({
      method: 'DELETE',
      url: `submission/${userId}/${taskId}`,
      success: (data) => {
        $('#status').text(JSON.stringify(data))
        updateCollection()
      }
    })
  })

  $('#retrieveAllBtn').on('click', () => {
    updateCollection()
  })
})