<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['statut'])) {
        $query = "SELECT * FROM Statut WHERE statut = :statut;";
        $params = array(':statut' => $_GET['statut']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM Statut;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $statut = $_POST['statut'];
    
    $query = "INSERT INTO Statut(statut) VALUES (:statut);";
    $params = array(':statut' => $statut);
    $queryAutoIncrement = "SELECT MAX(statut) as statut FROM Statut;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $id = $_GET['statut'];
    $statut = $_POST['statut'];
   
    $query = "UPDATE Statut SET statut=:statut WHERE statut=:id";
    $params = array(':statut' => $statut, ':id' => $id);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['statut'];
    
    $query = "DELETE FROM Statut WHERE statut = :statut";
    $params = array(':statut' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
