<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$type = $data['type'];
	$user = $data['user'];
	$chat = $data['chat'];
	$status = $data['status'];
	$content = htmlspecialchars($data['content'], ENT_QUOTES);
	$contentOriginal = htmlspecialchars($data['content_original'], ENT_QUOTES);

	if ($type == "create") {
		$sql = "INSERT INTO z_chat_conversation (chat, user, content, content_original, ip_address)
				VALUES ($chat, $user, '$content', '$contentOriginal', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		$inserted = getChatConversationComment($insertedId);
		echo json_encode($inserted);
		$conn->close();
	} else if ($type == "remove") {
		$status = ($status == 'remove') ? 1 : 0;

		$sql = "UPDATE z_chat_conversation
				SET is_deleted = $status, ip_address = '$ipAddress' 
				WHERE id = $id AND user = $user";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));
		$conn->close();
	}
?>