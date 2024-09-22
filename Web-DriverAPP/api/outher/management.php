<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idM'])) {
        $query = "SELECT t.idVcl, t.idM, t.idDecharge, de.date_decharge, m.label_mission, tr.label, t.date_P, t.liter, t.consom, t.PU, t.MTTC, t.currentKM, t.KM, t.deposit, v.regNumber, v.type FROM TrajManagement t JOIN Vehicle v ON v.idVcl = t.idVcl JOIN decharge de ON t.idDecharge = de.idDecharge JOIN association_md amd ON amd.idAMD = de.idAMD JOIN mission m ON m.idMission = amd.idMission JOIN trajectory tr ON tr.idTraj = m.idTraj WHERE idM = :idM;";
        $params = array(':idM' => $_GET['idM']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }
    if (isset($_GET['deposit']) && isset($_GET['role']) && $_GET['role'] != 'admin' && isset($_GET['idUser'])) {
        $query = "SELECT t.idVcl, t.idM, t.idDecharge, de.date_decharge, m.label_mission, tr.label, t.date_P, t.liter, t.consom, t.PU, t.MTTC, t.currentKM, t.KM, t.deposit, v.regNumber, v.type FROM TrajManagement t JOIN Vehicle v ON v.idVcl = t.idVcl JOIN decharge de ON t.idDecharge = de.idDecharge JOIN association_md amd ON amd.idAMD = de.idAMD JOIN mission m ON m.idMission = amd.idMission JOIN trajectory tr ON tr.idTraj = m.idTraj WHERE t.deposit = :deposit OR t.deposit IN (SELECT deposit FROM association_du WHERE idUser = :idUser);";
        $params = array(':deposit' => $_GET['deposit'], ':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } 
    else {
        $query = "SELECT t.idVcl, t.idM, t.idDecharge, de.date_decharge, m.label_mission, tr.label, t.date_P, t.liter, t.consom, t.PU, t.MTTC, t.currentKM, t.KM, t.deposit, v.regNumber, v.type FROM TrajManagement t JOIN Vehicle v ON v.idVcl = t.idVcl JOIN decharge de ON t.idDecharge = de.idDecharge JOIN association_md amd ON amd.idAMD = de.idAMD JOIN mission m ON m.idMission = amd.idMission JOIN trajectory tr ON tr.idTraj = m.idTraj;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idDecharge = $_POST['idDecharge'];
    $date_P = $_POST['date_P'];
    $idVcl = $_POST['idVcl'];
    $liter = $_POST['liter'];
    $consom = $_POST['consom'];
    $PU = $_POST['PU'];
    $MTTC = $_POST['MTTC'];
    $currentKM = $_POST['currentKM'];
    $KM = $_POST['KM'];
    $deposit = $_POST['deposit'];

    $query = "INSERT INTO TrajManagement(idDecharge, date_P, idVcl, liter, consom, PU, MTTC, currentKM, KM, deposit) VALUES (:idDecharge, :date_P, :idVcl, :liter, :consom, :PU, :MTTC, :currentKM, :KM, :deposit); UPDATE Vehicle SET km = :currentKM WHERE idVcl = :idVcl";
    $params = array(':idDecharge' => $idDecharge, ':date_P' => $date_P, ':idVcl' => $idVcl, ':liter' => $liter, ':consom' => $consom, ':PU' => $PU, ':MTTC' => $MTTC, ':currentKM' => $currentKM, ':KM' => $KM, ':deposit' => $deposit);
    $queryAutoIncrement = "SELECT MAX(idM) as idM FROM TrajManagement";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idM = $_GET['idM'];
    $idDecharge = $_POST['idDecharge'];
    $date_P = $_POST['date_P'];
    $idVcl = $_POST['idVcl'];
    $liter = $_POST['liter'];
    $consom = $_POST['consom'];
    $PU = $_POST['PU'];
    $MTTC = $_POST['MTTC'];
    $currentKM = $_POST['currentKM'];
    $km = $_POST['km'];
    $KM = $_POST['KM'];
    $deposit = $_POST['deposit'];

    $query = "UPDATE TrajManagement SET idDecharge = :idDecharge, date_P = :date_P, idVcl = :idVcl, liter = :liter, consom = :consom, PU = :PU, MTTC = :MTTC, currentKM = :currentKM, KM = :KM, deposit = :deposit WHERE idM = :idM; UPDATE Vehicle SET km = :km WHERE idVcl = :idVcl";
    $params = array(':idM' => $idM, ':idDecharge' => $idDecharge, ':date_P' => $date_P, ':idVcl' => $idVcl, ':liter' => $liter, ':consom' => $consom, ':PU' => $PU, ':MTTC' => $MTTC, ':currentKM' => $currentKM, ':KM' => $KM, ':deposit' => $deposit, ':km' => $km);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idM = $_GET['idM'];
    $query = "DELETE FROM TrajManagement WHERE idM = :idM";
    $params = array(':idM' => $idM);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
