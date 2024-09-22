<?php

include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');


// if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//     if (isset($_GET['idL'])) {
//         $query = "SELECT * FROM Livraison WHERE idL = :idL";
//         $params = array(':idL' => $_GET['idL']);
//         $result = metodGet($query, $params);
//         echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
//     } else {
//         $query = "SELECT * FROM Driver";
//         $result = metodGet($query);
//         echo json_encode($result->fetchAll());
//     }
//     header("HTTP/1.1 200 OK");
//     exit();
// }

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['idL'])) {
        $query = "SELECT l.*, tjm.idM, de.idDecharge, de.date_decharge,m.label_mission,d.nom, d.prenom, v.regNumber,v.type FROM livraison l JOIN trajmanagement tjm ON l.idM = tjm.idM JOIN decharge de ON tjm.idDecharge = de.idDecharge JOIN association_md amd ON de.idAMD = amd.idAMD JOIN mission m ON amd.idMission = m.idMission JOIN association_vd avd ON amd.idAVD = avd.idAVD JOIN driver d ON avd.idDriver = d.idDriver JOIN vehicle v ON avd.idVcl = v.idVcl where idL=:idL";
        $params = array(':idL' => $_GET['idL']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } 
    if (isset($_GET['deposit']) && isset($_GET['role']) && $_GET['role'] != 'admin' && isset($_GET['idUser'])) {
        $query = "SELECT l.*, tjm.idM, de.idDecharge, de.date_decharge,m.label_mission,d.nom, d.prenom, v.regNumber,v.type FROM livraison l JOIN trajmanagement tjm ON l.idM = tjm.idM JOIN decharge de ON tjm.idDecharge = de.idDecharge JOIN association_md amd ON de.idAMD = amd.idAMD JOIN mission m ON amd.idMission = m.idMission JOIN association_vd avd ON amd.idAVD = avd.idAVD JOIN driver d ON avd.idDriver = d.idDriver JOIN vehicle v ON avd.idVcl = v.idVcl WHERE l.deposit = :deposit OR l.deposit IN (SELECT deposit FROM association_du WHERE idUser = :idUser);";
        $params = array(':deposit' => $_GET['deposit'], ':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    } 
    else {
        $query = "SELECT l.*, tjm.idM, de.idDecharge, de.date_decharge,m.label_mission,d.nom, d.prenom, v.regNumber,v.type FROM livraison l JOIN trajmanagement tjm ON l.idM = tjm.idM JOIN decharge de ON tjm.idDecharge = de.idDecharge JOIN association_md amd ON de.idAMD = amd.idAMD JOIN mission m ON amd.idMission = m.idMission JOIN association_vd avd ON amd.idAVD = avd.idAVD JOIN driver d ON avd.idDriver = d.idDriver JOIN vehicle v ON avd.idVcl = v.idVcl";
        $result = metodGet($query);
        echo json_encode($result->fetchAll());
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'POST') {
    unset($_POST['METHOD']);
    $idM = $_POST['idM'];
    $blNumber = $_POST['blNumber'];
    $fctNumber = $_POST['fctNumber'];
    $nbr_camion_onee = $_POST['nbr_camion_onee'];
    $prix_fct = $_POST['prix_fct'];
    $brut = $_POST['brut'];
    $tare = $_POST['tare'];
    $net = $_POST['net'];
    $comentaire = $_POST['comentaire'];
    $observation = $_POST['observation'];
    $deposit = $_POST['deposit'];
    $valide = $_POST['valide'];
    
    $query = "INSERT INTO livraison(idM, blNumber, fctNumber, nbr_camion_onee, prix_fct, brut,tare,net,comentaire,observation,deposit,valide) VALUES (:idM, :blNumber, :fctNumber, :nbr_camion_onee, :prix_fct, :brut, :tare, :net, :comentaire, :observation,:deposit,:valide)";
    $params = array(':idM' => $idM, ':blNumber' => $blNumber, ':fctNumber' => $fctNumber, ':nbr_camion_onee' => $nbr_camion_onee, ':prix_fct' => $prix_fct, ':brut' => $brut, ':tare' => $tare, ':net' => $net, ':comentaire' => $comentaire, ':observation' => $observation,':deposit'=>$deposit,':valide'=>$valide);
    $queryAutoIncrement = "SELECT MAX(idL) as idL FROM livraison";
    $result = metodPost($query, $queryAutoIncrement, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'PUT') {
    unset($_POST['METHOD']);
    $idL = $_GET['idL'];
    $idM = $_POST['idM'];
    $blNumber = $_POST['blNumber'];
    $fctNumber = $_POST['fctNumber'];
    $nbr_camion_onee = $_POST['nbr_camion_onee'];
    $prix_fct = $_POST['prix_fct'];
    $brut = $_POST['brut'];
    $tare = $_POST['tare'];
    $net = $_POST['net'];
    $comentaire = $_POST['comentaire'];
    $observation = $_POST['observation'];
    $deposit = $_POST['deposit'];
    


    $query = "UPDATE livraison SET idM=:idM, blNumber=:blNumber, fctNumber=:fctNumber, nbr_camion_onee=:nbr_camion_onee, prix_fct=:prix_fct, brut=:brut, tare=:tare, net=:net, comentaire=:comentaire, observation=:observation, deposit = :deposit  WHERE idL=:idL"; 
    $params = array(':idL' => $idL,':idM' => $idM, ':blNumber' => $blNumber, ':fctNumber' => $fctNumber, ':nbr_camion_onee' => $nbr_camion_onee, ':prix_fct' => $prix_fct, ':brut' => $brut, ':tare' => $tare, ':net' => $net, ':comentaire' => $comentaire, ':observation' => $observation,':deposit' => $deposit);
   
    $result = metodPut($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

if ($_POST['METHOD'] == 'DELETE') {
    unset($_POST['METHOD']);
    $id = $_GET['idL'];
    
    $query = "DELETE FROM livraison WHERE idL = :idL";
    $params = array(':idL' => $id);
    $result = metodDelete($query, $params);
    echo json_encode($result);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>
