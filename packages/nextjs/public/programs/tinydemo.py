from nada_dsl import *

def nada_main():
    party1 = Party(name="Party1")
    my_int1 = SecretInteger(Input(name="my_int1", party=party1))
    guess = SecretInteger(Input(name="guess", party=party1))

    new_int = (my_int1 >= guess).if_else((my_int1 <= guess).if_else(Integer(1), Integer(0)), Integer(0))

    return [Output(new_int, "my_output", party1)]