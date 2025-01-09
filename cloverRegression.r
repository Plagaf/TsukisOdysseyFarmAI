

#Clovers y=Strange Rate, x=Num Clovers
y <- c(0.15,0.30,0.39,0.45,0.50,0.54,0.57,0.60,0.63,0.65,0.67,0.69,0.71,0.72,0.74,0.75,0.76,0.78,0.79,0.80,0.81)
x <- c(1:length(y))


modelo <- nls(y ~ a + b * log(x), start = list(a = 0, b = 1)) # Valores iniciales para a y b
summary(modelo)

plot(x, y)
lines(x, predict(modelo), col = "red")

# Coeficientes
coef(modelo)


modelo <- nls(y ~ a + b * log10(x), start = list(a = 0, b = 1)) # Valores iniciales para a y b
summary(modelo)
coef(modelo)





datos <- data.frame(
    x =x,
    y = y)


datos$x_transformada <- 1 + log2(datos$x)

modelo <- lm(y ~ 0 + x_transformada, data = datos)
summary(modelo)

m <- coef(modelo)[1]
cat("Ecuación: y = (1 + log2(x)) *", m, "\n")


# Comparación visual (opcional):
x_nuevos <- seq(1, 50, length.out = 100)
y_pred <- (1 + log2(x_nuevos)) * m
plot(datos$x, datos$y)





## 16 hojas
y <- c(0.76,0.91,0.99,1.05,1.1,1.14)
x <- c(1:length(y))

modelo <- nls(y ~ a + b * log(x), start = list(a = 0, b = 1)) # Valores iniciales para a y b
summary(modelo)

plot(x, y)
lines(x, predict(modelo), col = "red")

# Coeficientes
coef(modelo)


modelo <- nls(y ~ a + b * log10(x), start = list(a = 0, b = 1)) # Valores iniciales para a y b
summary(modelo)
coef(modelo)


plot(x, y)
lines(x, predict(modelo), col = "red")



modelo <- nls(y ~ a + b * log2(x), start = list(a = 0, b = 1)) # Valores iniciales para a y b
summary(modelo)
coef(modelo)


plot(x, y)
lines(x, predict(modelo), col = "red")



datos <- data.frame(x =x,
                   y = y)


datos$x_transformada <- 1 + log2(datos$x)

modelo <- lm(y ~ 0 + x_transformada, data = datos)
summary(modelo)

m <- coef(modelo)[1]
cat("Ecuación: y = (1 + log2(x)) *", m, "\n")



plot(x, y)
lines(x, predict(modelo), col = "red")


