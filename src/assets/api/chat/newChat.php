<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sender = $data['sender'];
	$receivers = $data['receivers'];

	// Create chat
	$sql = "INSERT INTO z_chat (user, ip_address)
			VALUES ($sender, '$ipAddress')";
	$result = $conn->query($sql);
	$insertedId = $conn->insert_id;

	// Create chat users
	foreach($receivers as $row){
		$sqlRow = "INSERT INTO z_chat_users (chat, user, ip_address)
					VALUES ($insertedId, '$row', '$ipAddress')";
		$result = $conn->query($sqlRow);
	}

	echo json_encode($insertedId);
	$conn->close();
?>
