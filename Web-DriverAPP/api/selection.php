<?php
include 'bd/myData.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['vd'])) {
        $query = "SELECT idDriver, nom, prenom FROM Driver WHERE active = 1 AND (idDriver IN (SELECT t1.idDriver FROM association_vd t1 JOIN ( SELECT idDriver, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idDriver ) t2 ON t1.idDriver = t2.idDriver AND t1.date_end = t2.max_date_end  WHERE t1.date_end <=  CURRENT_DATE()) OR idDriver NOT IN (SELECT idDriver FROM association_vd));";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['v'])) {
        $query = "SELECT * FROM vehicle WHERE active = 1 AND (idVcl IN (SELECT t1.idVcl FROM association_vd t1 JOIN ( SELECT idVcl, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idVcl ) t2 ON t1.idVcl = t2.idVcl AND t1.date_end = t2.max_date_end WHERE t1.date_end <= CURRENT_DATE()) OR idVcl NOT IN (SELECT idVcl FROM association_vd));";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['md'])) {
        $query = "SELECT a.idAVD, d.nom, d.prenom, v.type, v.regNumber FROM association_vd a JOIN driver d on a.idDriver = d.idDriver JOIN vehicle v on a.idVcl = v.idVcl WHERE d.dispo = 'disponible' AND d.active = 1 AND a.date_end >= CURRENT_DATE();";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['m'])) {
        $query = "SELECT idMission, label_mission FROM mission WHERE idMission IN (SELECT idMission FROM mission WHERE date_end >= CURRENT_DATE() AND idTraj = :id);";
        $params = array(':id' => $_GET['m']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['mq']) && isset($_GET['idTraj'])) {
        $query = "SELECT idMission, label_mission, quantite FROM mission WHERE date_end >= CURRENT_DATE() AND idTraj = :idTraj;";
        $params = array(':idTraj' => $_GET['idTraj']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['dechargeAVD']) && isset($_GET['idTraj'])) {
        $query = "SELECT am.idAVD, d.nom, d.prenom, v.regNumber, v.type FROM association_vd av JOIN association_md am ON av.idAVD = am.idAVD JOIN Driver d ON av.idDriver = d.idDriver JOIN Vehicle v on av.idVcl = v.idVcl WHERE am.date_end = '2999-01-01' AND am.idMission IN (SELECT idMission FROM mission WHERE idTraj = :idTraj);";
        $params = array(':idTraj' => $_GET['idTraj']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['dechargeAMD']) && isset($_GET['idAVD'])) {
        $query = "SELECT a.idAMD, a.idMission, m.quantite FROM association_md a JOIN mission m on a.idMission = m.idMission WHERE a.date_end = '2999-01-01' AND a.idAVD = :idAVD;";
        $params = array(':idAVD' => $_GET['idAVD']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['traj'])) {
        $query = "SELECT idTraj, label FROM Trajectory;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['suivi']) && isset($_GET['idMission'])) {
        $query = "SELECT am.idAMD, am.idMission, am.tonnage, d.nom, d.prenom, v.type, v.regNumber, am.date_start, am.date_end FROM association_vd av JOIN association_md am ON av.idAVD = am.idAVD JOIN Driver d ON av.idDriver = d.idDriver JOIN Vehicle v on av.idVcl = v.idVcl WHERE am.idMission = :idMission;";
        $params = array(':idMission' => $_GET['idMission']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['planifie']) && isset($_GET['idMission'])) {
        $query = "SELECT SUM(tonnage) AS planifie FROM association_md WHERE date_end = '2999-01-01' AND idMission = :idMission;";
        $params = array(':idMission' => $_GET['idMission']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['effectue']) && isset($_GET['idMission'])) {
        $query = "SELECT SUM(quantite) AS effectue FROM decharge WHERE idAMD IN (SELECT idAMD FROM association_md WHERE idMission = :idMission);";
        $params = array(':idMission' => $_GET['idMission']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['reste']) && isset($_GET['idMission'])) {
        $query = "SELECT m.quantite - SUM(dh.quantite) AS reste FROM mission m JOIN association_md a ON m.idMission = a.idMission JOIN decharge dh ON a.idAMD = dh.idAMD WHERE dh.idAMD IN (SELECT idAMD FROM association_md WHERE idMission = :idMission);";
        $params = array(':idMission' => $_GET['idMission']);
        $result = metodGet($query, $params);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['idUser']) && isset($_GET['role'])) {
        if($_GET['role'] != 'admin'){
            $query = "SELECT deposit FROM association_du WHERE idUser = :idUser;";
            $params = array(':idUser' => $_GET['idUser']);
            $result = metodGet($query, $params);
            
            if ($result->rowCount() > 0) {
                echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode([]);
            }
        } else {
            $query = "SELECT * FROM deposits GROUP BY deposit";
            $result = metodGet($query);

            if ($result->rowCount() > 0) {
                echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo json_encode([]);
            }
        }
    }

    if (isset($_GET['user'])) {
        $query = "SELECT * FROM users;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['profile'])) {
        $query = "SELECT * FROM profiles;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['idUser']) && isset($_GET['visibility'])) {
        $query = "SELECT p.page, p.visibility FROM profile p JOIN users u ON p.profile = u.profile WHERE u.idUser = :idUser;";
        $params = array(':idUser' => $_GET['idUser']);
        $result = metodGet($query, $params);
        echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    }

    if (isset($_GET['pages']) && isset($_GET['profileV2'])) {
        $query = "SELECT page FROM pages WHERE page NOT IN (SELECT page FROM profile WHERE profile = :profile);";
        $params = array(':profile' => $_GET['profileV2']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['client'])) {
        $query = "SELECT * FROM `3421` WHERE active = 1;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['produit'])) {
        $query = "SELECT * FROM `7111` WHERE active = 1;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['checkDriver']) && isset($_GET['idDriver'])) {
        $query = "SELECT EXISTS (SELECT 1 FROM association_vd WHERE date_end >= CURRENT_DATE() AND idDriver = :idDriver) AS checkDriver;";
        $params = array(':idDriver' => $_GET['idDriver']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetch(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['checkVcl']) && isset($_GET['idVcl'])) {
        $query = "SELECT EXISTS (SELECT 1 FROM association_vd WHERE date_end >= CURRENT_DATE() AND idVcl = :idVcl) AS checkVcl;";        $query = "SELECT EXISTS (SELECT 1 FROM association_vd WHERE date_end >= CURRENT_DATE() AND idVcl = :idVcl) AS checkVcl;";

        $params = array(':idVcl' => $_GET['idVcl']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetch(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['checkCli']) && isset($_GET['idC'])) {
        $query = "SELECT EXISTS (SELECT 1 FROM mission WHERE date_end >= CURRENT_DATE() AND idC = :idC) AS checkCli;";
        $params = array(':idC' => $_GET['idC']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetch(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['checkProd']) && isset($_GET['idP'])) {
        $query = "SELECT EXISTS (SELECT 1 FROM mission WHERE date_end >= CURRENT_DATE() AND idP = :idP) AS checkProd;";
        $params = array(':idP' => $_GET['idP']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetch(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['manDecharge']) && isset($_GET['idVcl'])) {
        $query = "SELECT * FROM decharge WHERE idVcl = :idVcl;";
        $params = array(':idVcl' => $_GET['idVcl']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['dechargeV3'])) {
        $query = "SELECT de.idDecharge FROM decharge de JOIN association_vd avd ON avd.idAVD = de.idAVD WHERE avd.idVcl = :idVcl AND de.idDecharge NOT IN(SELECT idDecharge FROM Trajmanagement);";
        $params = array(':idVcl' => $_GET['dechargeV3']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['trajectoryV3'])) {
        $query = "SELECT t.idTraj, t.label FROM trajectory t JOIN mission m ON m.idTraj = t.idTraj JOIN association_md amd ON amd.idMission = m.idMission JOIN decharge de ON de.idAMD = amd.idAMD WHERE de.idDecharge = :idDecharge;";
        $params = array(':idDecharge' => $_GET['trajectoryV3']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['vehicleV3'])) {
        $query = "SELECT * FROM vehicle WHERE active = 1 AND idVcl in (SELECT idVcl from association_vd) and (idVcl IN (SELECT t1.idVcl FROM association_vd t1 JOIN ( SELECT idAVD, idVcl, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idVcl ) t2 ON t1.idVcl = t2.idVcl AND t1.date_end = t2.max_date_end WHERE t2.idAVD IN(SELECT idAVD FROM decharge WHERE idDecharge NOT IN (SELECT idDecharge FROM trajmanagement))) OR idVcl NOT IN (SELECT idVcl FROM association_vd));";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['vehicleV4'])) {
        $query = "SELECT * FROM vehicle WHERE active = 1 AND idVcl in (SELECT idVcl from association_vd) and (idVcl IN (SELECT t1.idVcl FROM association_vd t1 JOIN ( SELECT idAVD, idVcl, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idVcl ) t2 ON t1.idVcl = t2.idVcl AND t1.date_end = t2.max_date_end WHERE t2.idVcl IN(SELECT idVcl FROM trajmanagement WHERE idM NOT IN (SELECT idM FROM livraison))) or idVcl  not IN (SELECT idVcl FROM association_vd));";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
  
    if (isset($_GET['gestionV1'])) {
        // $query = "SELECT idM, FROM trajmanagement tra join decharge de on   WHERE tra.idVcl=:idVcl AND idM NOT IN(SELECT idM FROM livraison);";
        $query = "SELECT tra.idM,de.date_decharge,m.label_mission,m.label_mission FROM trajmanagement tra join decharge de on tra.idDecharge=de.idDecharge join association_md amd on de.idAMD=amd.idAMD join mission m on amd.idMission=m.idMission  WHERE tra.idVcl=:idVcl AND idM NOT IN(SELECT idM FROM livraison);";
        $params = array(':idVcl' => $_GET['gestionV1']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }

    if (isset($_GET['dechargeV4'])) {
        // $query = "SELECT de.idDecharge FROM trajmanagement de WHERE idVcl=:idVcl AND idM NOT IN(SELECT idM FROM livraison);";
        $query = "SELECT de.idDecharge FROM trajmanagement de WHERE idM=:idM AND idM NOT IN(SELECT idM FROM livraison);";
        // $params = array(':idVcl' => $_GET['dechargeV4']);
        $params = array(':idM' => $_GET['dechargeV4']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['gestionV2'])) {
        $query = "select idM from trajmanagement WHERE idM not in (select idM from livraison);";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['autorouteV1'])) {
        $query = "select  *from autoroute WHERE idM not in (select idAutoroute from gestion_autoroute);";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['vehicleV5'])) {
        $query = "SELECT * FROM vehicle WHERE active = 1 AND idVcl in (SELECT idVcl from association_va) AND idVcl in (SELECT idVcl from association_vd) and (idVcl IN (SELECT t1.idVcl FROM association_vd t1 JOIN ( SELECT idAVD, idVcl, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idVcl ) t2 ON t1.idVcl = t2.idVcl AND t1.date_end = t2.max_date_end) or idVcl  not IN (SELECT idVcl FROM association_vd));";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['gestionV3'])) {
        // $query = "SELECT idM, FROM trajmanagement tra join decharge de on   WHERE tra.idVcl=:idVcl AND idM NOT IN(SELECT idM FROM livraison);";
        $query = "SELECT tra.idM,de.date_decharge,m.label_mission,m.label_mission,traj.label FROM trajmanagement tra join decharge de on tra.idDecharge=de.idDecharge join association_md amd on de.idAMD=amd.idAMD join mission m on amd.idMission=m.idMission JOIN trajectory traj on m.idTraj=traj.idTraj  WHERE tra.idVcl=:idVcl AND idM NOT IN(SELECT idM FROM gestion_autoroute);";
        $params = array(':idVcl' => $_GET['gestionV3']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['autorouteV2'])) {
        // $query = "SELECT idM, FROM trajmanagement tra join decharge de on   WHERE tra.idVcl=:idVcl AND idM NOT IN(SELECT idM FROM livraison);";
        $query = "SELECT idAutoroute,serial_number,solde FROM autoroute WHERE idAutoroute in (SELECT idAutoroute from association_va WHERE idVcl=:idVcl);        ";
        $params = array(':idVcl' => $_GET['autorouteV2']);
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['gestionV4'])) {
        $query = "select idM from trajmanagement WHERE idM not in (select idM from gestion_autoroute);";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['va'])) {
        $query = "SELECT a.idAutoroute,a.serial_number,a.solde FROM autoroute a where a.idAutoroute not in (SELECT idAutoroute from association_va);";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['autoroute_v'])) {
        $query = "SELECT * FROM vehicle WHERE active = 1 AND (idVcl IN (SELECT t1.idVcl FROM association_vd t1 JOIN ( SELECT idVcl, MAX(date_end) AS max_date_end FROM association_vd GROUP BY idVcl ) t2 ON t1.idVcl = t2.idVcl AND t1.date_end = t2.max_date_end WHERE t1.date_end < CURRENT_DATE()) OR idVcl NOT IN (SELECT idVcl FROM association_vd)) and idVcl not IN(SELECT idVcl from association_va);";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['depos'])) {
        $query = "SELECT * FROM deposits ORDER BY deposits.deposit;";
        $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['solde'])) {
        $query = "select solde FROM solde_caisse WHERE idSolde=:idSolde;";
        $params = array(':idSolde' => $_GET['solde']);
        $result = metodGet($query, $params);
        // $result = metodGet($query);
        
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
        $query = "
            SELECT 
                d.idDriver,
                d.ste , 
                d.numE,
                d.nom , 
                d.prenom ,
                d.numRib,
                d.type_contrat,
                d.Num_CNSS, 
                COUNT(CASE WHEN p.statut = 1 THEN 1 END) AS total_status_1,
                COUNT(CASE WHEN p.statut = 1 AND DAYNAME(p.date_pointing) = 'Sunday' THEN 1 END) AS total_sunday_status_1,
                CASE WHEN P.statut =1 THEN SUM(p.avance) END AS avance
            FROM 
                driver d
            JOIN 
                pointing p ON d.idDriver = p.idDriver
            WHERE 
                p.date_pointing BETWEEN :startDate AND :endDate
            GROUP BY 
                d.numE,d.ste, d.nom, d.prenom, d.numRib, d.Num_CNSS, d.type_contrat
            LIMIT 0, 25;
        ";
        
        $params = array(
            ':startDate' => $_GET['startDate'],
            ':endDate' => $_GET['endDate']
        );
        
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    // if (isset($_GET['driver_P'])&& isset($_GET['date_P'])) {
    //     $query = "SELECT d.idDriver, d.nom, d.prenom,p.statut FROM Driver d LEFT JOIN pointing p ON d.idDriver = p.idDriver AND p.date_pointing = :date_P WHERE d.active = 1 AND d.idDriver IN (SELECT idDriver FROM association_vd) AND (p.idDriver IS NULL OR p.date_pointing IS NOT NULL);";
    //     $result = metodGet($query);
        
    //     if ($result->rowCount() > 0) {
    //         echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    //     } else {
    //         echo json_encode([]);
    //     }
    // }

    // isset($_GET['date_pointing '])
    // if (isset($_GET['driver_P'])  ) {
    //     $query = "SELECT d.idDriver, d.nom, d.prenom FROM Driver d LEFT JOIN pointing p ON d.idDriver = p.idDriver AND p.date_pointing = :date_P  WHERE d.active = 1 AND d.idDriver IN (SELECT idDriver FROM association_vd) AND (p.idDriver IS NULL OR p.date_pointing IS NOT NULL);";

    //     //  $params = array(':date_P ' => $_GET['date_P']);
    //     $result = metodGet($query);
        
    //     if ($result->rowCount() > 0) {
    //         echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
    //     } else {
    //         echo json_encode([]);
    //     }
    // }
    if (isset($_GET['startDateP']) && isset($_GET['endDateP'])) {
        $query = "SELECT d.idDriver, d.nom, d.prenom,p.statut,p.date_pointing,p.idP,p.avance FROM pointing p  LEFT JOIN Driver d  ON d.idDriver = p.idDriver AND p.date_pointing BETWEEN :startDate AND :endDate WHERE d.active = 1 AND d.idDriver IN (SELECT idDriver FROM association_vd) AND (p.idDriver IS NULL OR p.date_pointing IS NOT NULL);" ;
        
        $params = array(
            ':startDate' => $_GET['startDateP'],
            ':endDate' => $_GET['endDateP']
        );
        
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['startDateRP']) && isset($_GET['endDateRP']) && isset($_GET['statut'])) {
        $query = "SELECT p.date_pointing,p.idP, d.nom, d.prenom, d.numE, v.regNumber,a.idAVD,p.statut FROM association_vd a
        JOIN driver d on a.idDriver = d.idDriver 
        JOIN vehicle v on a.idVcl = v.idVcl 
        Join pointing p on d.idDriver=p.idDriver where p.statut=:statut and (p.date_pointing BETWEEN a.date_start and a.date_end) and p.date_pointing BETWEEN :startDate and :endDate ;";
        
        $params = array(
            ':startDate' => $_GET['startDateRP'],
            ':endDate' => $_GET['endDateRP'],
            ':statut' => $_GET['statut'],
        );
        
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    if (isset($_GET['startDateSUM1']) && isset($_GET['endDateSUM1']) && isset($_GET['idSolde']) ) {
        $query = "SELECT 
        SUM(CASE 
                WHEN sens = 1 THEN montant 
                ELSE montant * -1 
            END) AS total_sum
    FROM 
        Caisse where idSolde=:idSolde and date_caisse BETWEEN :startDate and :endDate;";
        
        $params = array(
            ':startDate' => $_GET['startDateSUM1'],
            ':endDate' => $_GET['endDateSUM1'],
            ':idSolde' => $_GET['idSolde'],

        );
        
        $result = metodGet($query, $params);
        if ($result->rowCount() > 0) {
            echo json_encode($result->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode([]);
        }
    }
    



    // header("HTTP/1.1 200 OK");
    exit();
}

?>
