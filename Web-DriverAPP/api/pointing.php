<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['date_pointing'])) {
    $query = "SELECT d.idDriver, d.nom, d.prenom,p.statut,p.date_pointing,p.idP,p.avance,p.idUser,u.username,p.userUpdate FROM Driver d LEFT JOIN pointing p ON d.idDriver = p.idDriver AND p.date_pointing =:date LEFT JOIN users u on p.idUser=u.idUser  WHERE d.active = 1 AND d.idDriver IN (SELECT idDriver FROM association_vd) AND (p.idDriver IS NULL OR p.date_pointing IS NOT NULL);";
        $params = array(':date' => $_GET['date_pointing']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } 
    else {
    $query = "SELECT d.idDriver, d.nom, d.prenom,p.statut,p.date_pointing,p.idP,p.avance,p.idUser,u.username,p.userUpdate FROM Driver d LEFT JOIN pointing p ON d.idDriver = p.idDriver AND p.date_pointing =CURRENT_DATE() LEFT JOIN users u on p.idUser=u.idUser WHERE d.active = 1 AND d.idDriver IN (SELECT idDriver FROM association_vd) AND (p.idDriver IS NULL OR p.date_pointing IS NOT NULL);";

        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}







if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idDriver = $_POST['idDriver'];
   
    $date_pointing = $_POST['date_pointing'];
    $avance = $_POST['avance'];
    $idUser = $_POST['idUser'];

   
    // $statut = $_POST['statut'];
    
    $query = "INSERT INTO pointing(idDriver,date_pointing,statut,avance,idUser) VALUES (:idDriver,:date_pointing, 1,:avance,:idUser)";
    $params = array(':idDriver' => $idDriver, ':date_pointing' => $date_pointing,':avance'=>$avance,':idUser'=>$idUser);
    $queryAutoIncrement = "SELECT MAX(idP) as idP FROM pointing";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idP = $_GET['idP'];
    // $idDriver = $_POST['idDriver'];


    // $date_pointing = $_POST['date_pointing'];

    $avance = $_POST['avance'];
    $statut = $_POST['statut'];
    $userUpdate = $_POST['userUpdate'];

    $query = "UPDATE pointing set statut=:statut ,avance=:avance,userUpdate=:userUpdate

    -- SET statut = CASE 
    --     WHEN statut = 1 THEN 0 
    --     ELSE 1 
    -- END 
    WHERE idP = :idP";

    $params = array(':idP' => $idP,':avance'=>$avance,':statut'=>$statut,':userUpdate'=>$userUpdate);
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idP'];
    $query = "DELETE FROM pointing WHERE idP = :idP ";
    

    $params = array(':idP' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

// if ($_POST['METHOD'] == 'DELETE') {
//     unset($_POST['METHOD']);
//     $id = $_GET['idP'];
    
//     // Check if idP exists in the pointing table
//     $checkQuery = "SELECT COUNT(*) AS count FROM pointing WHERE idP = :idP";
//     $checkParams = array(':idP' => $id);
//     $checkResult = metodGet($checkQuery, $checkParams);
//     $rowCount = $checkResult->fetch(PDO::FETCH_ASSOC)['count'];
    
//     if ($rowCount === 0) {
//         // If idP doesn't exist, return an error response
//         $response = array('message' => 'pointing not found');
//         http_response_code(404); // Set HTTP status code to 404 (Not Found)
//         echo json_encode($response);
//         exit();
//     }
    
//     // Proceed with deletion if idP exists
//     $query = "SELECT CASE WHEN EXISTS (SELECT 1 FROM association_vd WHERE idP = :idP) THEN TRUE ELSE FALSE END AS result; ";
    
//     $params = array(':idP' => $id);
//     $result = metodGet($query, $params);
   
//     $checkResult = $result->fetch(PDO::FETCH_ASSOC);
//     if ($checkResult['result'] == 0) {
//         // Deletion allowed, execute DELETE query
//         $deleteQuery = "DELETE FROM pointing WHERE idP = :idP";
//         $deleteParams = array(':idP' => $id);
        
//         $deleteResult =  metodDelete($deleteQuery, $deleteParams);
        
//         $response = array('message' => 'Deletion successful');
//         http_response_code(200);
//     } else {
//         $response = array('message' => 'Deletion not allowed');
//         http_response_code(400); // Set HTTP status code to 400 (Bad Request)
//     }
    
//     // Send response
//     echo json_encode($response);
//     exit();
// }





header("HTTP/1.1 400 Bad Request");
?>
