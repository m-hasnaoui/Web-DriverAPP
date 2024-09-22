<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM deposits GROUP BY deposit;";
    $result = metodGet($query);
    echo json_encode($result->fetchAll());

    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $deposit = $_POST['deposit'];

    $query = "INSERT INTO deposits(deposit) VALUES (:deposit)";
    $queryOrdered = "SELECT * FROM deposits GROUP BY deposit";
    $params = array(':deposit' => $deposit);
    $result = metodPost($query, $queryOrdered, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $id = $_GET['deposit'];
    $deposit = $_POST['deposit'];

    $query = "UPDATE deposits SET deposit = :deposit WHERE deposit = :id";
    $params = array(':deposit' => $deposit, ':id' => $id);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $deposit = $_POST['deposit'];

    $query = "DELETE FROM deposits WHERE deposit = :deposit";
    $params = array(':deposit' => $deposit);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
