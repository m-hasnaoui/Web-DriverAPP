<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idVcl'])) {
        $query = "SELECT u.username, vehicle.* FROM vehicle join users u on vehicle.idUser=u.idUser  WHERE idVcl = :idVcl ;";
        $params = array(':idVcl' => $_GET['idVcl']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT u.username , vehicle.* FROM vehicle join users u on vehicle.idUser=u.idUser;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $regNumber = $_POST['regNumber'];
    $type = $_POST['type'];

    $deposit = $_POST['deposit'];
    $active = $_POST['active'];
    $idUser = $_POST['idUser'];

    $query = "INSERT INTO vehicle(regNumber, type, deposit,  active, idUser) VALUES (:regNumber, :type, :deposit, :active, :idUser);";
    $params = array(
        ':regNumber' => $regNumber,
        ':type' => $type,
        ':deposit' => $deposit,

        ':active' => $active,
        ':idUser' => $idUser
    );
    $queryAutoIncrement = "SELECT MAX(idVcl) as idVcl FROM vehicle;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}


if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idVcl = $_GET['idVcl'];
    $regNumber = $_POST['regNumber'];
    $type = $_POST['type'];
    $deposit = $_POST['deposit'];
    $active = $_POST['active'];

    $query = "UPDATE vehicle SET regNumber = :regNumber, type = :type, deposit = :deposit, active = :active WHERE idVcl = :idVcl;";
    $params = array(':idVcl' => $idVcl, ':regNumber' => $regNumber, ':type' => $type, ':deposit' => $deposit, ':active' => $active);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idVcl = $_GET['idVcl'];
    $query = "DELETE FROM vehicle WHERE idVcl = :idVcl;";
    $params = array(':idVcl' => $idVcl);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
