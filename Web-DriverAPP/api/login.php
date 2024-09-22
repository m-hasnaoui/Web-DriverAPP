<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['username'])) {
        $query = "SELECT * FROM Users WHERE username = :username";
        $params = array(':username' => $_GET['username']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    }
    header("HTTP/1.1 200 OK");
    exit();
}

?>
