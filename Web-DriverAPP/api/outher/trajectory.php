<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idTraj'])) {
        $query = "SELECT * FROM Trajectory WHERE idTraj = :idTraj";
        $params = array(':idTraj' => $_GET['idTraj']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } else {
        $query = "SELECT * FROM Trajectory";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $label = $_POST['label'];
    $start = $_POST['start'];
    $end = $_POST['end'];
    $distance = $_POST['distance'];
    $date_traj = $_POST['date_traj'];
    $price = $_POST['price'];
    $prime = $_POST['prime'];
    
    $query = "INSERT INTO Trajectory(label, start, end, distance, date_traj, price, prime) VALUES (:label, :start, :end, :distance, :date_traj, :price, :prime)";
    $params = array(':label' => $label, ':start' => $start, ':end' => $end, ':distance' => $distance, ':date_traj' => $date_traj, ':price' => $price, ':prime' => $prime);
    $queryAutoIncrement = "SELECT MAX(idTraj) as idTraj FROM Trajectory";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idTraj = $_GET['idTraj'];
    $label = $_POST['label'];
    $start = $_POST['start'];
    $end = $_POST['end'];
    $distance = $_POST['distance'];
    $date_traj = $_POST['date_traj'];
    $price = $_POST['price'];
    $prime = $_POST['prime'];
    
    $query = "UPDATE Trajectory SET label = :label, start = :start, end = :end, distance = :distance, date_traj = :date_traj, price = :price, prime = :prime WHERE idTraj = :idTraj";
    $params = array(':idTraj' => $idTraj, ':label' => $label, ':start' => $start, ':end' => $end, ':distance' => $distance, ':date_traj' => $date_traj, ':price' => $price, ':prime' => $prime);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idTraj = $_GET['idTraj'];
    $query = "DELETE FROM Trajectory WHERE idTraj = :idTraj";
    $params = array(':idTraj' => $idTraj);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");

?>
