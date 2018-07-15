<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['user'];

	$sql = "SELECT id, sender, receiver, 
					page_id as page, 
					page_url as url, 
					page_type as type, 
					comment_id as comment, 
					status, date 
			FROM z_notifications 
			WHERE receiver = $user AND is_deleted = 0 
			ORDER BY date DESC 
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['sender']);

			// Upgrade status
			if ($row['status'] == '0')
				updateNotificationStatus($row['id']);

			// Followers
			if ($row['url'] == 'followers') {
				$row['statusFollowing'] = checkFollowingStatus($user, $row['sender']);
				$row['private'] = checkUserPrivacy($row['sender']);
			}

			// Photos
			if ($row['url'] == 'photos')
				$row['contentData'] = getIdNameContentMediaCommentFromPhotoById($row['page'], $row['comment']);

			// Publications
			if ($row['url'] == 'publications')
				$row['contentData'] = getIdNameContentMediaCommentFromPublicationById($row['page'], $row['comment']);

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>
