<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idDecharge'])) {
        $query = "SELECT dh.idDecharge, am.idAMD, av.idAVD, am.idMission, d.nom, d.prenom, v.regNumber, v.type, dh.quantite, dh.date_decharge FROM decharge dh JOIN association_md am on am.idAMD = dh.idAMD JOIN association_vd av on dh.idAVD = av.idAVD JOIN driver d ON d.idDriver = av.idDriver JOIN vehicle v ON v.idVcl = av.idVcl WHERE dh.idDecharge = :idDecharge;";
        $params = array(':idDecharge' => $_GET['idDecharge']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT dh.idDecharge, am.idAMD, av.idAVD, am.idMission, d.nom, d.prenom, v.regNumber, v.type, dh.quantite, dh.date_decharge FROM decharge dh JOIN association_md am on am.idAMD = dh.idAMD JOIN association_vd av on dh.idAVD = av.idAVD JOIN driver d ON d.idDriver = av.idDriver JOIN vehicle v ON v.idVcl = av.idVcl;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idAVD = $_POST['idAVD'];
    $idAMD = $_POST['idAMD'];
    $quantite = $_POST['quantite'];
    $date_decharge = $_POST['date_decharge'];

    $query = "INSERT INTO decharge(idAVD, idAMD, quantite, date_decharge) VALUES (:idAVD, :idAMD, :quantite, :date_decharge); UPDATE association_md SET date_end = :date_decharge WHERE idAMD = :idAMD;";
    $params = array(':idAVD' => $idAVD, ':idAMD' => $idAMD, ':quantite' => $quantite, ':date_decharge' => $date_decharge);
    $queryAutoIncrement = "SELECT MAX(idDecharge) as idDecharge FROM decharge";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idDecharge = $_GET['idDecharge'];
    $idAVD = $_POST['idAVD'];
    $idAMD = $_POST['idAMD'];
    $quantite = $_POST['quantite'];
    $date_decharge = $_POST['date_decharge'];

    $query = "UPDATE decharge SET idAVD = :idAVD, idAMD = :idAMD, quantite = :quantite, date_decharge = :date_decharge WHERE idDecharge = :idDecharge";
    $params = array(':idDecharge' => $idDecharge, ':idAVD' => $idAVD, ':idAMD' => $idAMD, ':quantite' => $quantite, ':date_decharge' => $date_decharge);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idDecharge = $_GET['idDecharge'];
    $query = "UPDATE association_md SET date_end = '2999-01-01' WHERE idAVD IN (SELECT idAVD FROM decharge WHERE idDecharge = :idDecharge); DELETE FROM decharge WHERE idDecharge = :idDecharge;";
    $params = array(':idDecharge' => $idDecharge);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
