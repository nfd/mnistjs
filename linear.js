function appendones(m) {
	/* Adds a ones column for neural network bias neurons. */
	var result = m.slice();

	for(var i = 0; i < result.length; i++) {
		result[i].push(1);
	}
	return result;
}

function logistic(m) {
	/* Logistic operation over 2D matrix M */
	var result = [];

	for(y = 0; y < m.length; y++) {
		var result_row = []

		for(x = 0; x < m[y].length; x++) {
			var f = 1.0 / (1.0 + Math.exp(-m[y][x]));
			result_row.push(f);
		}
		result.push(result_row);
	}

	return result;
}

function arraymult(m1, m2) {
	/* Pairwise multiplication for 2D arrays (only), i.e.
	 *
	 * a = 1 2    b = 5 6    arraymult(a, b) = 1*5 2*6
	 *     3 4        7 8                      3*7 4*8
	 *
	 * a's width must equal b's height (this is not checked)
	*/

	var result = [];

	for(y = 0; y < m1.length; y++) {

		row = []
		for(x = 0; x < m1[y].length; x++) {
			row.push(m1[y][x] * m2[y][x]);
		}
		result.push(row);
	}

	return result;
}

function matmult(m1, m2) {
	/* Matrix multiplication for 2D arrays (only), i.e.
	 *
	 *
	 * a = 1 2    b = 5 6    matmult(a, b) = 1*5+2*7 1*6+2*8
	 *     3 4        7 8                    3*5+4*7 3*6+4*8
	 *
	 * the width and height of a and b must be the same (this is not checked)
	*/
	
	var m1_height = m1.length;
	var m1_width = m1[0].length;
	var m2_height = m2.length;
	var m2_width = m2[0].length;

    var result = [];

	for(var result_idx = 0; result_idx < m1_height; result_idx++) {
		var result_row = [];
		for(var x = 0; x < m2_width; x++) {
			var sum = 0;

			for(var y = 0; y < m1_width; y++) {
				sum += m1[result_idx][y] * m2[y][x];
			}
			result_row.push(sum);
		}
		result.push(result_row);
	}

    return result;
}

function transpose(m) {
	var m_cols = m[0].length;
	var m_rows = m.length;

	var out = [];
	for(m_col = 0; m_col < m_cols; m_col++) {
		out_row = []
		for(m_row = 0; m_row < m_rows; m_row++) {
			out_row.push(m[m_row][m_col]);
		}
		out.push(out_row);
	}

	return out;
}

