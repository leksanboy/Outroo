<?php include "../db.php";
	$user = $_GET['user'];
	$caption = $_GET['caption'];
	$cuantity = $_GET['cuantity'];

	$sql = "SELECT u.id, u.about 
			FROM z_following f 
				INNER JOIN z_users u ON f.receiver = u.id AND f.is_deleted = 0 
			WHERE f.sender = $user 
				AND (u.name LIKE '%$caption%' OR username LIKE '%$caption%')";
	$result = $conn->query($sql);

	$data = array();
	while($row = $result->fetch_assoc()) {
		$row['user'] = userUsernameNameAvatar($row['id']);
		$row['about'] = html_entity_decode($row['about'], ENT_QUOTES);
		$data[] = $row;
	}

	echo json_encode($data);
	$conn->close();
?>
