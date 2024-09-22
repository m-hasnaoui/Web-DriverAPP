<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idMission'])) {
        $query = "SELECT m.idMission, m.label_mission, m.idC, c.nom_c , c.prenom_c, p.idP, p.designation, t.idTraj, t.label, m.date_start, m.date_end, m.type_operation, m.quantite, m.unite, m.statut, m.date_c FROM mission m JOIN Trajectory t ON t.idTraj = m.idTraj join `3421` c on c.idC=m.idC join `7111` p on p.idP=m.idP WHERE m.idMission = :idMission;";
        $params = array(':idMission' => $_GET['idMission']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetch(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT m.idMission, m.label_mission, m.idC, c.nom_c , c.prenom_c, p.idP, p.designation, t.idTraj, t.label, m.date_start, m.date_end, m.type_operation, m.quantite, m.unite, m.statut, m.date_c FROM mission m JOIN Trajectory t ON t.idTraj = m.idTraj join `3421` c on c.idC=m.idC join `7111` p on p.idP=m.idP;";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $label_mission = $_POST['label_mission'];
    $idC = $_POST['idC'];
    $idP = $_POST['idP'];
    $idTraj = $_POST['idTraj'];
    $date_start = $_POST['date_start'];
    $date_end = $_POST['date_end'];
    $type_operation = $_POST['type_operation'];
    $quantite = $_POST['quantite'];
    $unite = $_POST['unite'];
    $statut = $_POST['statut'];

    $query = "INSERT INTO mission(label_mission, idC, idP, idTraj, date_start, date_end, type_operation, quantite, unite, statut) VALUES (:label_mission, :idC, :idP, :idTraj, :date_start, :date_end, :type_operation, :quantite, :unite, :statut);";
    $params = array(':label_mission' => $label_mission, ':idC' => $idC, ':idP' => $idP , ':idTraj' => $idTraj, ':date_start' => $date_start, ':date_end' => $date_end, ':type_operation' => $type_operation, ':quantite' => $quantite, ':unite' => $unite, ':statut' => $statut);
    $queryAutoIncrement = "SELECT MAX(idMission) as idMission FROM mission";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idMission = $_GET['idMission'];
    $label_mission = $_POST['label_mission'];
    $idC = $_POST['idC'];
    $idP = $_POST['idP'];
    $idTraj = $_POST['idTraj'];
    $date_start = $_POST['date_start'];
    $date_end = $_POST['date_end'];
    $type_operation = $_POST['type_operation'];
    $quantite = $_POST['quantite'];
    $unite = $_POST['unite'];
    $statut = $_POST['statut'];

    $query = "UPDATE mission SET label_mission = :label_mission ,idC = :idC ,idP = :idP, idTraj = :idTraj, date_start = :date_start, date_end = :date_end, type_operation = :type_operation, quantite = :quantite, unite = :unite, statut = :statut WHERE idMission = :idMission";
    $params = array(':idMission' => $idMission, ':label_mission' => $label_mission, ':idC' => $idC,':idP' => $idP , ':idTraj' => $idTraj, ':date_start' => $date_start, ':date_end' => $date_end, ':type_operation' => $type_operation, ':quantite' => $quantite, ':unite' => $unite, ':statut' => $statut);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idMission = $_GET['idMission'];
    $query = "DELETE FROM mission WHERE idMission = :idMission;";
    $params = array(':idMission' => $idMission);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
