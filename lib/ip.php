<?php
    $ip = file_get_contents('https://api.ipify.org?format=json');
    header('Content-type: application/json');
    echo $ip;

    // DEV USE:
    // $myip = json_decode($ip, true);
    // echo $myip["ip"];
?>