<?php
// Database connection settings
$host = "localhost";
$user = "root";
$pass = "";
$db = "pahingakape";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['cart']) && is_array($data['cart'])) {
    foreach ($data['cart'] as $item) {
        $name = $item['name'];
        $quantity = intval($item['quantity']);
        $subtotal = floatval($item['subtotal']);

        $stmt = $conn->prepare("INSERT INTO orders (item, quantity, subtotal) VALUES (?, ?, ?)");
        $stmt->bind_param("sid", $name, $quantity, $subtotal);
        $stmt->execute();
        $stmt->close();
    }
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "No cart data received"]);
}

$conn->close();
?>