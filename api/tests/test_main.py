import pytest
from myheart.process import classify_heart_rate

def test_classify_heart_rate_normal():
    assert classify_heart_rate(60) == "NORMAL"
    assert classify_heart_rate(80) == "NORMAL"
    assert classify_heart_rate(100) == "NORMAL"

def test_classify_heart_rate_high():
    assert classify_heart_rate(101) == "HIGH"
    assert classify_heart_rate(150) == "HIGH"
    assert classify_heart_rate(180) == "HIGH"

def test_classify_heart_rate_boundary():
    # Boundary case: 100 should be NORMAL, 101 should be HIGH
    assert classify_heart_rate(100) == "NORMAL"
    assert classify_heart_rate(101) == "HIGH"
