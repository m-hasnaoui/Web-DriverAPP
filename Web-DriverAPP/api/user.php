<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idUser'])) {
        $query = "SELECT * FROM users WHERE idUser = :idUser";
        $params = array(':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM users";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $username = $_POST['username'];
    $password = $_POST['password'];
    $profile = $_POST['profile'];
    $role = $_POST['role'];
    $deposit = $_POST['deposit'];
    $active = $_POST['active'];

    $query = "INSERT INTO users(username, password, profile, role, deposit, active) VALUES (:username, :password, :profile, :role, :deposit, :active)";
    $queryAutoIncrement = "SELECT MAX(idUser) as idUser FROM users";
    $params = array(':username' => $username, ':password' => $password, ':profile' => $profile, ':role' => $role, ':deposit' => $deposit, ':active' => $active);
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idUser = $_GET['idUser'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $profile = $_POST['profile'];
    $role = $_POST['role'];
    $deposit = $_POST['deposit'];
    $active = $_POST['active'];
    
    $query = "UPDATE users SET username = :username, password = :password, profile = :profile, role = :role, deposit = :deposit, active = :active WHERE idUser = :idUser";
    $params = array(':idUser' => $idUser, ':username' => $username, ':password' => $password, ':profile' => $profile, ':role' => $role, ':deposit' => $deposit, ':active' => $active);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idUser'];
    $query = "DELETE FROM users WHERE idUser = :id";
    $params = array(':id' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
