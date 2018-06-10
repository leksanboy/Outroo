<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$id = $_GET['id'];

	$sql = "SELECT id, user, date, comment
			FROM z_photos_comments
			WHERE photo = $id AND is_deleted = 0 
			ORDER BY date DESC 
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	$data = array();
	while($row = $result->fetch_assoc()) {
		$row['user'] = userUsernameNameAvatar($row['user']);
		$row['comment'] = html_entity_decode($row['comment'], ENT_QUOTES);
		$data[] = $row;
	}

	echo json_encode($data);
	$conn->close();
?>
