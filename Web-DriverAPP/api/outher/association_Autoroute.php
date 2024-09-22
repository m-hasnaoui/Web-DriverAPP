<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idAVA'])) {
        $query = "SELECT a.idAVA, a.idVcl, d.idAutoroute,d.serial_number,d.solde,v.regNumber, v.type, a.date_ava FROM association_va a JOIN autoroute d ON d.idAutoroute = a.idAutoroute JOIN vehicle v ON v.idVcl = a.idVcl WHERE a.idAVA = :idAVA;";
        $params = array(':idAVA' => $_GET['idAVA']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT a.idVcl, a.idAVA, d.idAutoroute,d.serial_number,d.solde,v.regNumber, v.type, a.date_ava FROM association_va a JOIN autoroute d ON d.idAutoroute = a.idAutoroute JOIN vehicle v ON v.idVcl = a.idVcl;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idAutoroute = $_POST['idAutoroute'];
    $idVcl = $_POST['idVcl'];
    $date_ava = $_POST['date_ava'];


    $query = "INSERT INTO association_va(idAutoroute, idVcl, date_ava) VALUES (:idAutoroute, :idVcl, :date_ava)";
    $params = array(':idAutoroute' => $idAutoroute, ':idVcl' => $idVcl, ':date_ava' => $date_ava);
    $queryAutoIncrement = "SELECT MAX(idAVA) as idAVA FROM association_va;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idAVA = $_GET['idAVA'];
    $idAutoroute = $_POST['idAutoroute'];
    $idVcl = $_POST['idVcl'];
    $date_ava = $_POST['date_ava'];


    $query = "UPDATE association_va SET idAutoroute = :idAutoroute, idVcl = :idVcl, date_ava = :date_ava WHERE idAVA = :idAVA;";
    $params = array(':idAVA' => $idAVA, ':idAutoroute' => $idAutoroute, ':idVcl' => $idVcl, ':date_ava' => $date_ava);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idAVA = $_GET['idAVA'];
    $query = "DELETE FROM association_va WHERE idAVA = :idAVA;";
    $params = array(':idAVA' => $idAVA);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
