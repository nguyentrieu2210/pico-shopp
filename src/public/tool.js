
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
const validatePassword = (password) => {
    if(password.length<6 || password.length>12) {
        return false;
    }
    return true;
}
const validateFullname = (full_name) => {
    const minNameLength = 2;
    const maxNameLength = 50;
    const regex = /^[a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\s]+$/;
  
    if (
      full_name.length < minNameLength ||
      full_name.length > maxNameLength ||
      !regex.test(full_name)
    ) {
      return false;
    }
  
    return true;
}
const validatePhone = (phoneNumber) => {
    const regex = /^(0|\+84)\d{9}$/;

    return regex.test(phoneNumber);
}
const validateAddress = (address) => {
    const minAddressLength = 2;
    const maxAddressLength = 100;
    // const regex = /^[a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\s]+$/;
    const regex = /^[a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ\s\.\-\,\#]+$/;
  
    if (
      address.length < 2 ||
      address.length > 100 ||
      !regex.test(address)
    ) {
      return false;
    }
  
    return true;
}
function checkNullInput(value,check_null, inputElement) {
    if(value==="") {
        check_null.style.display="block";
        inputElement.style.border="1px solid red";
        inputElement.focus();
    }else{
        check_null.style.display="none";
        inputElement.style.border="1px solid #DCDCDC";
    }
}
function styleInput(value,check_null, bool, warning_name, inputElement) {
    if(value==="") {
        warning_name.style.display="none";
        check_null.style.display="block";
        inputElement.style.border="1px solid red";
        inputElement.focus();
    }else{
        check_null.style.display="none";
        if(bool) {
            warning_name.style.display="none";
            inputElement.style.border="1px solid #DCDCDC";
        }else{
            warning_name.style.display="block";
            inputElement.style.border="1px solid red";
            inputElement.focus();
        }
    }
}   
function changeStar(number_star) {
    let old_elements = document.getElementsByClassName("commentStar");
    for (let item of old_elements) {
        item.style.color = "RGB(218, 218, 218)";
    }
    for (let i = 1; i <= number_star; i++) {
        let star = i * 10;
        let element = document.getElementById(star);
        element.style.color = "RGB(255, 166, 65)";
    }
}