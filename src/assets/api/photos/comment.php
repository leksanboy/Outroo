<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$type = $data['type'];
	$user = $data['user'];
	$photo = $data['photo'];
	$id = $data['id'];

	if ($type == "create") {
		$comment = htmlspecialchars($data['comment'], ENT_QUOTES);

		$sql = "INSERT INTO z_photos_comments (user, photo, comment, ip_address)
				VALUES ($user, $photo, '$comment', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		$inserted = getPhotoComment($insertedId);
		echo json_encode($inserted);
		$conn->close();
	} else if ($type == "add" || $type == "remove") {
		$status = ($type == 'remove') ? 1 : 0;

		$sql = "UPDATE z_photos_comments
				SET is_deleted = $status, ip_address = '$ipAddress' 
				WHERE id = $id";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));
		$conn->close();
	}
?>
