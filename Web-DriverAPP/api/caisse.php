<?php
include 'bd/myData.php';
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['startDate']) &&isset($_GET['endDate'])) {
        $query = "SELECT u.username,caisse.* FROM caisse join users u on caisse.idUser=u.idUser  WHERE date_caisse BETWEEN :startDate AND :endDate  and idSolde=1;  ";
        $params = array(':startDate' => $_GET['startDate'],':endDate' => $_GET['endDate']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    // } else {
    //     $query = "SELECT * FROM caisse  ";
    //     // where date_caisse=CURRENT_DATE()
    //     $result = metodGet($query);
    //     echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $date_caisse = $_POST['date_caisse'];
    $designation = $_POST['designation'];
    $num_bl = $_POST['num_bl'];
    $montant = $_POST['montant'];
    // $avance = $_POST['avance'];
    $sens = $_POST['sens']; 
    $idUser = $_POST['idUser']; // sens will have values 1 or -1

    $query = "INSERT INTO caisse(date_caisse, designation, num_bl, montant,sens, idSolde,idUser) 
              VALUES (:date_caisse, :designation, :num_bl, :montant, :sens, 1,:idUser);";
    if ($sens == 1) {
        $query .= " UPDATE solde_caisse SET solde = (solde + :montant) WHERE idSolde = 1;";
    } elseif ($sens == -1) {
        $query .= " UPDATE solde_caisse SET solde = (solde - :montant) WHERE idSolde = 1;";
    } else {
        exit("Invalid sens value");
    }

    $params = array(
        ':date_caisse' => $date_caisse,
        ':designation' => $designation,
        ':num_bl' => $num_bl,
        ':montant' => $montant,
        // ':avance' => $avance,
        ':sens' => $sens,
        ':idUser'=>$idUser
    );
    $queryAutoIncrement = "SELECT MAX(idCaisse) as idCaisse FROM caisse;";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idCaisse = $_GET['idCaisse'];
    $date_caisse = $_POST['date_caisse'];
    $designation = $_POST['designation'];
    $num_bl = $_POST['num_bl'];
    $montant = $_POST['montant'];
    // $avance = $_POST['avance'];
    $sens = $_POST['sens'];  // sens will have values 1 or -1

    $query = "UPDATE caisse SET date_caisse = :date_caisse, designation = :designation, 
              num_bl = :num_bl, montant = :montant,  sens = :sens, idSolde = 1 
              WHERE idCaisse = :idCaisse;";
    $params = array(
        ':idCaisse' => $idCaisse,
        ':date_caisse' => $date_caisse,
        ':designation' => $designation,
        ':num_bl' => $num_bl,
        ':montant' => $montant,
        // ':avance' => $avance,
        ':sens' => $sens
    );
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $idCaisse = $_GET['idCaisse'];
    $montant = $_POST['montant'];
    $sens = $_POST['sens'];  // sens will have values 1 or -1

    if ($sens == 1 ) {
        $query = "UPDATE solde_caisse SET solde = (solde - :montant) WHERE idSolde = 1;";
    } elseif ($sens == -1) {
        $query = "UPDATE solde_caisse SET solde = (solde + :montant) WHERE idSolde = 1;";
    } else {
        echo json_encode(array("error" => "Invalid sens value"));
        exit();
    }

    $query .= " DELETE FROM caisse WHERE idCaisse = :idCaisse;";
    $params = array(':idCaisse' => $idCaisse, ':montant' => $montant);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
