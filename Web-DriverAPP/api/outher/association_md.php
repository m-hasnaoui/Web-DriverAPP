<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idAMD'])) {
        $query = "SELECT a.idAMD, a.idMission, m.label_mission, av.idAVD, av.idDriver, av.idVcl, d.nom, d.prenom, v.type, v.regNumber, a.tonnage, a.date_start, a.date_end FROM association_md a JOIN association_vd av ON a.idAVD = av.idAVD JOIN driver d ON d.idDriver = av.idDriver JOIN vehicle v ON v.idVcl = av.idVcl JOIN mission m ON m.idMission = a.idMission WHERE a.idAMD = :idAMD;";
        $params = array(':idAMD' => $_GET['idAMD']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT a.idAMD, a.idMission, m.label_mission, av.idAVD, d.idDriver, av.idVcl, d.nom, d.prenom, v.type, v.regNumber, a.tonnage, a.date_start, a.date_end FROM association_md a JOIN association_vd av ON a.idAVD = av.idAVD JOIN driver d ON d.idDriver = av.idDriver JOIN vehicle v ON v.idVcl = av.idVcl JOIN mission m ON m.idMission = a.idMission;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idAVD = $_POST['idAVD'];
    $idMission = $_POST['idMission'];
    $tonnage = $_POST['tonnage'];
    $date_start = $_POST['date_start'];
    $date_end = $_POST['date_end'];

    $query = "INSERT INTO association_md(idAVD, idMission, tonnage, date_start, date_end) VALUES (:idAVD, :idMission, :tonnage, :date_start, :date_end);UPDATE driver SET dispo='non disponible' WHERE idDriver IN (SELECT idDriver FROM association_vd WHERE idAVD = :idAVD);";
    $params = array(':idAVD' => $idAVD, ':idMission' => $idMission, ':tonnage' => $tonnage, ':date_start' => $date_start, ':date_end' => $date_end);
    $queryAutoIncrement = "SELECT MAX(idAMD) as idAMD FROM association_md";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idAMD = $_GET['idAMD'];
    $idAVD = $_POST['idAVD'];
    $idMission = $_POST['idMission'];
    $tonnage = $_POST['tonnage'];
    $date_start = $_POST['date_start'];
    // $date_end = $_POST['date_end'];

    $query = "UPDATE association_md SET idAVD = :idAVD, idMission = :idMission, tonnage = :tonnage, date_start = :date_start WHERE idAMD = :idAMD";
    $params = array(':idAMD' => $idAMD, ':idAVD' => $idAVD, ':idMission' => $idMission, ':tonnage' => $tonnage, ':date_start' => $date_start);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idAMD = $_GET['idAMD'];
    $query = "DELETE FROM association_md WHERE idAMD = :idAMD";
    $params = array(':idAMD' => $idAMD);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
