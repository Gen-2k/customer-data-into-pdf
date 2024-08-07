<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

// Get the current page from query parameters, default to 1
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = 10; // Number of records per page
$offset = ($page - 1) * $limit;

// Fetch the customer data with pagination
$sql = "SELECT * FROM customers LIMIT $limit OFFSET $offset";
$result = $conn->query($sql);

$customers = [];
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $customers[] = $row;
  }
}

// Get the total number of records for pagination
$total_sql = "SELECT COUNT(*) as total FROM customers";
$total_result = $conn->query($total_sql);
$total_row = $total_result->fetch_assoc();
$total_records = $total_row['total'];
$total_pages = ceil($total_records / $limit);

// Prepare the response
$response = [
    'customers' => $customers,
    'total_pages' => $total_pages,
    'current_page' => $page
];

// Output as JSON
echo json_encode($response);

$conn->close();
?>
