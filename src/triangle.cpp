// Xtriangle.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//

#include "pch.h"
#include <iostream>
#include "vector"
#include "string"
#include <windows.h>;

using namespace std;

string equilateralTriangleMessage = "равносторонний";
string isoscelesTriangleMessage = "равнобедренный";
string commonTriangleMessage = "обычный";

string errorMessageIncorrectArgs = "Некорректный ввод. Правильным вводом считается: 'XTriangle a b c', где a, b и c числового неотрицательного типа";
string errorMessageIsNotTriangle = "Это не треугольник";

double StringToDouble(const char * str, bool & err)
{
	char * pLastChar = nullptr;
	double param = strtod(str, &pLastChar);
	err = ((*str == '\0') || (*pLastChar != '\0'));
	return param;
}

bool isTriangle(double a, double b, double c) {
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
	for (int i = 1; i < argc; i++) {
		double param_one = StringToDouble(argv[i], error);
		param_one = round(param_one * 100) / 100;
		if (error || param_one <= 0) {
			cout << errorMessageIncorrectArgs << endl;
			return 1;
		}

		sidesTriangle.push_back(param_one);
	}

	double sideA = sidesTriangle[0];
	double sideB = sidesTriangle[1];
	double sideC = sidesTriangle[2];

	if (!isTriangle(sideA, sideB, sideC)) {
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