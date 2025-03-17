-- 4.1 SELECT ข้อมูล STORE ที่มี REGION เป็น EAST
SELECT *
FROM STORE
WHERE Region = 'East';

-- Store 1 (New York)
-- Store 3 (Atlanta)
-- Store 6 (Philadelphia)

-- 4.2 SELECT ข้อมูล PRODUCT ที่มีขายใน STORE New York 
SELECT p.*
FROM PRODUCT p
JOIN SALES_FACT sf ON p.Product_key = sf.Product_key
JOIN STORE s ON sf.Store_key = s.Store_key
WHERE s.City = 'New York';

--  return keys 6 and 2

-- 4.3 SELECT ยอดรวม Profit ของ STORE New York  

SELECT SUM(Profit) AS Total_Profit
FROM SALES_FACT sf
JOIN STORE s ON sf.Store_key = s.Store_key
WHERE s.City = 'New York';

-- returning 11.03

-- 4.4 DELETE ข้อมูล SALE_FACT ที่PRODUCT มีBrand เป็น Wolf 
DELETE FROM SALES_FACT
WHERE Product_key IN (
    SELECT Product_key
    FROM PRODUCT
    WHERE Brand = 'Wolf'
);

-- products 2 and 4 (Toy Story and Holiday of the Year)

-- 4.5 UPDATE Brand ของ PRODUCT ที่มีDescription เป็น Toy Story ให้Brand เป็น W
UPDATE PRODUCT
SET Brand = 'W'
WHERE Description = 'Toy Story';
