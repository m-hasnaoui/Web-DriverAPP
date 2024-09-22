<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['type'])) {
        $query = "SELECT * FROM type_operation WHERE type = :type;";
        $params = array(':type ' => $_GET['type ']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM type_operation;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $type = $_POST['type'];

    $query = "INSERT INTO type_operation(type) VALUES (:type);";
    $params = array(':type' => $type);
    $queryAutoIncrement = "SELECT MAX(type) as type FROM type_operation;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $id  = $_GET['type'];
    $type = $_POST['type'];

    $query = "UPDATE type_operation SET type=:type WHERE type =:id;";
    $params = array(':type ' => $type , ':id' => $id);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['type'];

    $query = "DELETE FROM type_operation WHERE type = :type;";
    $params = array(':type ' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
