<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$private = $data['private'];

	// update data
	$sql = "UPDATE z_users
			SET private = '$private',
				ip_address_update = '$ipAddress'
			WHERE id = $id";
	$result = $conn->query($sql);

	// get user data
	$userData = userData($id);
	echo json_encode($userData);
	$conn->close();
?>
