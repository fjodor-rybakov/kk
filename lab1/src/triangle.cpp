// Xtriangle.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//

#include "pch.h"
#include <iostream>
#include "vector"
#include "string"
#include <windows.h>

using namespace std;

string equilateralTriangleMessage = "равносторонний";
string isoscelesTriangleMessage = "равнобедренный";
string commonTriangleMessage = "обычный";

string errorMessageIncorrectArgs = "Некорректный ввод. Правильным вводом считается: 'triangle.exe a b c', где a, b и c числового неотрицательного типа и не равны 0";
string errorMessageIsNotTriangle = "Это не треугольник";
string errorMessageOverflow = "Числа слишком большие";

double StringToDouble(const char * str, bool & error)
{
	char * pLastChar = nullptr;
	double param = strtod(str, &pLastChar);
	error = ((*str == '\0') || (*pLastChar != '\0'));
	return param;
}

bool isOverflow(double a, double b) 
{
	return ((a < 0.0) == (b < 0.0) && abs(b) > numeric_limits<double>::infinity() - abs(a));
}

bool isTriangle(double a, double b, double c, bool & error)
{
	error = (isOverflow(a, b) || isOverflow(a, c) || isOverflow(c, b));
	return (a + b > c && a + c > b && b + c > a);
}

int main(int argc, char* argv[])
{
	SetConsoleCP(1251);
	SetConsoleOutputCP(1251);

	if (argc != 4) 
	{
		cout << errorMessageIncorrectArgs << endl;
		return 1;
	}

	vector<double> sidesTriangle;
	bool error;
	char * value;
	for (int i = 1; i < argc; i++) {
		value = strpbrk(argv[i], ",");
		if (value) {
			*value = '.';
		}
		double param_one = StringToDouble(argv[i], error);
		param_one = round(param_one * 100) / 100;

		if (param_one == numeric_limits<double>::infinity()) 
		{
			cout << errorMessageOverflow << endl;
			return 1;
		}

		if (error || param_one <= 0) 
		{
			cout << errorMessageIncorrectArgs << endl;
			return 1;
		}

		sidesTriangle.push_back(param_one);
	}

	double sideA = sidesTriangle[0];
	double sideB = sidesTriangle[1];
	double sideC = sidesTriangle[2];

	if (!isTriangle(sideA, sideB, sideC, error)) 
	{
		if (error) {
			cout << errorMessageOverflow << endl;
			return 1;
		}
		cout << errorMessageIsNotTriangle << endl;
		return 1;
	}

	if (sideA == sideB && sideB == sideC && sideC == sideA) {
		cout << equilateralTriangleMessage << endl;
		return 0;
	}

	if (sideA == sideB || sideB == sideC || sideC == sideA) {
		cout << isoscelesTriangleMessage << endl;
		return 0;
	}

	cout << commonTriangleMessage << endl;
	return 0;
}