<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idP'])) {
        $query = "SELECT * FROM `7111` WHERE idP = :idP;";
        $params = array(':idP' => $_GET['idP']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM `7111`;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $designation = $_POST['designation'];
    $prix = $_POST['prix'];
    $stock = $_POST['stock'];
    $active = $_POST['active'];
    
    $query = "INSERT INTO `7111`(designation, prix, stock, active) VALUES (:designation, :prix, :stock, :active)";
    $params = array(':designation' => $designation, ':prix' => $prix, ':stock' => $stock, ':active' => $active);
    $queryAutoIncrement = "SELECT MAX(idP) as idP FROM `7111`";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idP = $_GET['idP'];
    $designation = $_POST['designation'];
    $prix = $_POST['prix'];
    $stock = $_POST['stock'];
    $active = $_POST['active'];

    $query = "UPDATE `7111` SET designation=:designation, prix=:prix, stock=:stock, active=:active WHERE idP=:idP";
    $params = array(':idP' => $idP, ':designation' => $designation, ':prix' => $prix, ':stock' => $stock, ':active' => $active);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idP'];
    
    $query = "DELETE FROM `7111` WHERE idP = :idP;";
    $params = array(':idP' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
