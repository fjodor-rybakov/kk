@echo off
chcp 1251
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��������������
triangle.exe 1 1 1
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��������������
triangle.exe 2 3 3
echo ------------------------------------------------------------------------------
echo ��������� ���������: �������
triangle.exe 3 4 5
echo ------------------------------------------------------------------------------
echo ��������� ���������: ������������ ����...
triangle.exe 3 4 a
echo ------------------------------------------------------------------------------
echo ��������� ���������: ������������ ����...
triangle.exe 3 2
echo ------------------------------------------------------------------------------
echo ��������� ���������: ������������ ����...
triangle.exe 3 4 -5
echo ------------------------------------------------------------------------------
echo ��������� ���������: ������������ ����...
triangle.exe 3 0 5
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��� �� �����������
triangle.exe 1 2 6
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��������������
triangle.exe 1.00 1.00 1.00
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��������������
triangle.exe 1.005 1.003 1.001
echo ------------------------------------------------------------------------------
echo ��������� ���������: ��������������
triangle.exe 1.00 1.009 1.005
echo ------------------------------------------------------------------------------
pause