 //so that the form validation js part of the bootstap can be added successfully
 //here we are adding the basic client side validations to the form so that all the data has to be entered before going further..
 (function () {
    'use strict'

    bsCustomFileInput.init()//this is part of that bs-custom-file input for displaying the file names with multiple input.
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validate-form')
  
    // Loop over them and prevent submission
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()
  //we are adding this stuff in the bolierplate so that it is present in all the form related page ...