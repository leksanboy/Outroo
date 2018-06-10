<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['user'];

	$sql = "SELECT c.id
			FROM z_chat c
				INNER JOIN z_chat_users u ON c.id = u.chat
			WHERE u.user = $user AND u.is_deleted = 0
			ORDER BY c.date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	$data = array();
	while($row = $result->fetch_assoc()) {
		$row['users'] = getChatConversationUsers($row['id']);
		$row['conversation'] = getChatConversation($row['id']);
		$row['last'] = getChatConversationLastComment($row['id']);
		
		$data[] = $row;
	}

	echo json_encode($data);
	$conn->close();
?>
