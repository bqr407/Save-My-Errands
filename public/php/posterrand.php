<?php
if(isset($_POST["submit"]))
{
    //get variables from html form
    $name = $_POST['name'];
    $email = $_POST['email'];
    $errandtitle = $_POST['errandtitle'];
    $description = $_POST['description'];
    $usercontact = $_POST['usercontact'];
    $date = getdate();
    $hash =  mt_rand(100000000000, 999999999999);
    $hashaddress = "mywebsite.com/manage?errand=" . $hash;

    print_r($name);
    print_r($email);
    print_r($errandtitle);
    print_r($description);
    print_r($usercontact);
    print_r($hash);
    print_r($hashaddress);
    print_r(getdate());
    print_r($date);
}
?>