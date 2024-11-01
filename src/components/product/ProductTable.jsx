import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { t } from "i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const ProductTable = ({ products, isCheck, setIsCheck }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { currency, getNumberTwo } = useUtilsFunction();
  const [fetchedProducts, setFetchedProducts] = useState(null);

  const fetchProductByUUID = async (uuid) => {
    try {
      const response = await axios.get(
        `https://suft-90bec7a20f24.herokuapp.com/product/single/${uuid}`
      );
      if (response.data) {
        setFetchedProducts(response.data);
        console.log("Fetched Product for editing by UUID:", response.data);
      }
    } catch (error) {
      console.error("Error fetching product by UUID:", error);
    }
  };

  const handleEdit = async (uuid) => {
    await fetchProductByUUID(uuid);
    handleUpdate(uuid);
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  return (
    <>
      {isCheck?.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck?.length < 2 && (
        <MainDrawer>
          <ProductDrawer
            currency={currency}
            id={serviceId}
            product={fetchedProducts}
          />
        </MainDrawer>
      )}

      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={product.id || i}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={product?.name || "NoNameAvailable"}
                id={product.id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(product.id)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {product?.imageUrl?.[0] ? (
                  <Avatar
                    className="md:block bg-gray-50 p-1 mr-2 shadow-none"
                    src={product.imageUrl[0]}
                    alt="product"
                  />
                ) : (
                  <Avatar
                    src={
                      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"
                    }
                    alt="product"
                  />
                )}
                <div>
                  <h2
                    className={`text-sm font-medium ${
                      product?.name?.length > 30 ? "wrap-long-title" : ""
                    }`}
                  >
                    {product?.name || "NoNameAvailable"}
                  </h2>
                  <span className="text-xs text-gray-500">
                    SKU: {product?.sku || "N/A"}
                  </span>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {getNumberTwo(product?.price) || "0.00"}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {getNumberTwo(product?.salePrice || product?.price || 0)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{product.stockLevel || "Unknown"}</span>
            </TableCell>

            <TableCell>
              {product.isAvailable ? (
                <Badge type="success">{t("Selling")}</Badge>
              ) : (
                <Badge type="danger">{t("SoldOut")}</Badge>
              )}
            </TableCell>

            <TableCell>
              <Link
                to={`/product/${product.uuid}`}
                className="hover:text-emerald-600 flex justify-center text-gray-400"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("DetailsTbl")}
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={product.uuid}
                product={product}
                isCheck={isCheck}
                handleUpdate={() => handleEdit(product.uuid)}
                handleModalOpen={handleModalOpen}
                title={product?.name || "NoNameAvailable"}
              />
            </TableCell>
          </TableRow>
        ))}

        {fetchedProducts && (
          <TableRow>
            <TableCell colSpan="10">
              <div className="p-4">
                <h2 className="text-lg font-bold">
                  {fetchedProducts.name || "NoNameAvailable"}
                </h2>
                <p>{fetchedProducts.description || "NoDescriptionAvailable"}</p>
                <p className="font-semibold">
                  {currency}
                  {fetchedProducts.price || "0.00"}
                </p>
                <p className="text-sm">
                  Quantity: {fetchedProducts.stockLevel || "Unknown"}
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
};

export default ProductTable;
