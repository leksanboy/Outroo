<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$photo = $data['photo'];
	$user = $data['user'];
	$type = $data['type'];

	if ($type == "like") { // Add
		$sql = "INSERT INTO z_photos_likes (user, photo, ip_address)
				VALUES ($user, $photo, '$ipAddress')";
		$result = $conn->query($sql);
		
		var_dump(http_response_code(204));
		$conn->close();
	} else if ($type == "unlike") { // Remove
		$sql = "DELETE FROM z_photos_likes
				WHERE photo = $photo AND user = $user";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));
		$conn->close();
	}
?>