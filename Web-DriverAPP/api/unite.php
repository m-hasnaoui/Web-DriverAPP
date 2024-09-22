<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['unite'])) {
        $query = "SELECT * FROM unites WHERE unite = :unite;";
        $params = array(':unite' => $_GET['unite']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM unites;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $unite = $_POST['unite'];
    
    $query = "INSERT INTO unites(unite) VALUES (:unite);";
    $params = array(':unite' => $unite);
    $queryAutoIncrement = "SELECT MAX(unite) as unite FROM unites;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $id = $_GET['unite'];
    $unite = $_POST['unite'];
    
    $query = "UPDATE unites SET unite=:unite WHERE unite=:id;";
    $params = array(':unite' => $unite, ':id' => $id);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['unite'];

    $query = "DELETE FROM unites WHERE unite=:unite;";
    $params = array(':unite' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
