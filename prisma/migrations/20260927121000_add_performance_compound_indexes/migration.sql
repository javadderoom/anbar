-- CreateIndex
CREATE INDEX "OrderRequest_status_createdAt_idx" ON "OrderRequest"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "OrderRequest_clientId_createdAt_idx" ON "OrderRequest"("clientId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Product_isActive_category_idx" ON "Product"("isActive", "category");

-- CreateIndex
CREATE INDEX "Product_isActive_createdAt_idx" ON "Product"("isActive", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Product_isActive_stockQuantity_idx" ON "Product"("isActive", "stockQuantity");
